/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Send, MessageCircle, Lock, X } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useGetRideMessagesQuery,
  useMarkRideMessagesReadMutation,
  useSendRideMessageMutation,
} from '@/redux/features/Chat/chat.api';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { rideSocket } from '@/lib/socket';
import { cn } from '@/lib/utils';

const ACTIVE_STATUSES = new Set(['ACCEPTED', 'PICKED UP', 'IN TRANSIT']);

interface ChatPanelProps {
  rideId: string;
  rideStatus: string;
  /** The other participant in the ride (driver, if I'm the rider — or vice versa) */
  counterpart?: { name?: string; image?: string } | null;
}

export default function ChatPanel({
  rideId,
  rideStatus,
  counterpart,
}: ChatPanelProps) {
  const { data: userInfo } = useUserInfoQuery(undefined);
  const currentUserId = userInfo?.data?._id;

  const canChat = ACTIVE_STATUSES.has(rideStatus);
  const [isOpen, setIsOpen] = useState(false);

  const {
    data: messages,
    isLoading,
    isError,
  } = useGetRideMessagesQuery(rideId, { skip: !rideId });

  const [sendMessage, { isLoading: isSending }] = useSendRideMessageMutation();
  const [markRead] = useMarkRideMessagesReadMutation();
  const [draft, setDraft] = useState('');
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const lastSeenLengthRef = useRef(0);

  const unreadCount = useMemo(
    () =>
      messages?.filter(
        (m) => m.sender?._id !== currentUserId && m.readAt == null
      ).length ?? 0,
    [messages, currentUserId]
  );

  // Mark as read only while the widget is open — like Messenger, the badge
  // stays until you actually open the thread.
  useEffect(() => {
    if (!rideId || !canChat || !isOpen || !messages) return;
    const hasUnreadForMe = messages.some(
      (m) => m.sender?._id !== currentUserId && m.readAt == null
    );
    if (hasUnreadForMe) {
      if (rideSocket.isOpen()) {
        rideSocket.send({ type: 'chat:read', rideId });
      } else {
        markRead(rideId);
      }
    }
  }, [rideId, canChat, isOpen, messages, currentUserId, markRead]);

  // Auto-scroll on new messages only if user is already near the bottom
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || !messages) return;
    const justAddedMessage = messages.length > lastSeenLengthRef.current;
    lastSeenLengthRef.current = messages.length;
    if (!justAddedMessage) return;
    const distanceFromBottom =
      el.scrollHeight - (el.scrollTop + el.clientHeight);
    if (distanceFromBottom < 120) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  // Jump to bottom whenever the widget is opened
  useEffect(() => {
    if (!isOpen) return;
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [isOpen]);

  const grouped = useMemo(() => {
    if (!messages) return [];
    return messages;
  }, [messages]);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || !canChat) return;
    setDraft('');

    if (rideSocket.isOpen()) {
      rideSocket.send({ type: 'chat:send', rideId, text });
    } else {
      try {
        await sendMessage({ rideId, text }).unwrap();
      } catch (err: any) {
        console.warn('chat send failed', err);
      }
    }
  };

  const initials = counterpart?.name?.slice(0, 2).toUpperCase() ?? '?';

  return (
    <div className='fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3'>
      {isOpen && (
        <div className='w-80 sm:w-96 h-[30rem] max-h-[70vh] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden'>
          {/* Header */}
          <div className='flex items-center gap-2.5 px-4 py-3 bg-primary text-primary-foreground shrink-0'>
            <Avatar className='w-8 h-8 border-2 border-white/30 shrink-0'>
              <AvatarImage src={counterpart?.image} />
              <AvatarFallback className='text-xs bg-white/20 text-primary-foreground'>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-semibold truncate'>
                {counterpart?.name ?? 'Ride chat'}
              </p>
              {!canChat && (
                <p className='text-[10px] opacity-80 flex items-center gap-1'>
                  <Lock className='w-2.5 h-2.5' /> Closed
                </p>
              )}
            </div>
            <button
              type='button'
              onClick={() => setIsOpen(false)}
              className='p-1.5 rounded-full hover:bg-white/15 transition-colors shrink-0'
              aria-label='Close chat'
            >
              <X className='w-4 h-4' />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollerRef}
            className='flex-1 overflow-y-auto p-3 space-y-2 bg-secondary/20'
          >
            {isLoading ? (
              <div className='space-y-2'>
                <Skeleton className='h-9 w-3/4' />
                <Skeleton className='h-9 w-2/3 ml-auto' />
                <Skeleton className='h-9 w-1/2' />
              </div>
            ) : isError ? (
              <p className='text-sm text-muted-foreground text-center py-6'>
                Couldn't load messages.
              </p>
            ) : grouped.length === 0 ? (
              <p className='text-sm text-muted-foreground text-center py-6'>
                {canChat
                  ? 'No messages yet. Say hi 👋'
                  : 'Chat opens once the driver accepts the ride.'}
              </p>
            ) : (
              grouped.map((m) => {
                const mine = m.sender?._id === currentUserId;
                return (
                  <div
                    key={m._id}
                    className={cn(
                      'flex gap-1.5 items-end max-w-[80%]',
                      mine ? 'ml-auto flex-row-reverse' : 'mr-auto'
                    )}
                  >
                    <Avatar className='w-6 h-6 shrink-0'>
                      <AvatarImage src={m.sender?.image} />
                      <AvatarFallback className='text-[9px]'>
                        {m.sender?.name?.slice(0, 2).toUpperCase() ?? '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        'rounded-[18px] px-3.5 py-2 text-sm leading-snug',
                        mine
                          ? 'bg-primary text-primary-foreground rounded-br-md'
                          : 'bg-secondary text-foreground rounded-bl-md'
                      )}
                    >
                      <p className='whitespace-pre-wrap break-words'>
                        {m.text}
                      </p>
                      <div
                        className={cn(
                          'mt-0.5 text-[10px] flex items-center gap-1',
                          mine
                            ? 'text-primary-foreground/70'
                            : 'text-muted-foreground'
                        )}
                      >
                        <span>
                          {new Date(m.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {mine && <span>{m.readAt ? '✓✓' : '✓'}</span>}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className='flex items-center gap-2 border-t border-border p-2.5 shrink-0 bg-card'
          >
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={
                canChat ? 'Aa' : 'Chat opens after acceptance'
              }
              disabled={!canChat || isSending}
              maxLength={2000}
              className='flex-1 rounded-full bg-secondary/40 border-transparent focus-visible:border-primary'
            />
            <Button
              type='submit'
              size='icon'
              className='rounded-full shrink-0'
              disabled={!canChat || !draft.trim() || isSending}
              aria-label='Send message'
            >
              <Send className='w-4 h-4' />
            </Button>
          </form>
        </div>
      )}

      {/* Floating action button */}
      <button
        type='button'
        onClick={() => setIsOpen((o) => !o)}
        className='relative w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform'
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <X className='w-5 h-5' />
        ) : counterpart?.image ? (
          <Avatar className='w-full h-full'>
            <AvatarImage src={counterpart.image} className='object-cover' />
            <AvatarFallback className='bg-primary text-primary-foreground'>
              {initials}
            </AvatarFallback>
          </Avatar>
        ) : (
          <MessageCircle className='w-6 h-6' />
        )}
        {!isOpen && unreadCount > 0 && (
          <span className='absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-background'>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}
