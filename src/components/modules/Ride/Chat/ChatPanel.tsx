/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Send, MessageCircle, Lock } from 'lucide-react';

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
}

export default function ChatPanel({ rideId, rideStatus }: ChatPanelProps) {
  const { data: userInfo } = useUserInfoQuery(undefined);
  const currentUserId = userInfo?.data?._id;

  const canChat = ACTIVE_STATUSES.has(rideStatus);

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

  // Mark as read on mount + when new messages arrive that are for me
  useEffect(() => {
    if (!rideId || !canChat || !messages) return;
    const hasUnreadForMe = messages.some(
      (m) => m.sender?._id !== currentUserId && m.readAt == null
    );
    if (hasUnreadForMe) {
      // Prefer socket; REST fallback for offline
      if (rideSocket.isOpen()) {
        rideSocket.send({ type: 'chat:read', rideId });
      } else {
        markRead(rideId);
      }
    }
  }, [rideId, canChat, messages, currentUserId, markRead]);

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
      // REST fallback when socket is down
      try {
        await sendMessage({ rideId, text }).unwrap();
      } catch (err: any) {
        console.warn('chat send failed', err);
      }
    }
  };

  return (
    <div className='bg-card border border-border rounded-xl flex flex-col h-[28rem] overflow-hidden'>
      <div className='flex items-center gap-2 px-4 py-3 border-b border-border'>
        <MessageCircle className='w-4 h-4 text-muted-foreground' />
        <h3 className='text-sm font-semibold text-foreground'>Ride chat</h3>
        {!canChat && (
          <span className='ml-auto inline-flex items-center gap-1 text-[11px] text-muted-foreground'>
            <Lock className='w-3 h-3' /> Closed
          </span>
        )}
      </div>

      <div
        ref={scrollerRef}
        className='flex-1 overflow-y-auto p-4 space-y-2'
      >
        {isLoading ? (
          <div className='space-y-2'>
            <Skeleton className='h-10 w-3/4' />
            <Skeleton className='h-10 w-2/3 ml-auto' />
            <Skeleton className='h-10 w-1/2' />
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
                  'flex gap-2 max-w-[85%]',
                  mine ? 'ml-auto flex-row-reverse' : 'mr-auto'
                )}
              >
                {!mine && (
                  <Avatar className='w-7 h-7 shrink-0 mt-1'>
                    <AvatarImage src={m.sender?.image} />
                    <AvatarFallback className='text-[10px]'>
                      {m.sender?.name?.slice(0, 2).toUpperCase() ?? '?'}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'rounded-2xl px-3 py-2 text-sm leading-snug shadow-xs',
                    mine
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-secondary text-foreground rounded-bl-md'
                  )}
                >
                  <p className='whitespace-pre-wrap break-words'>{m.text}</p>
                  <div
                    className={cn(
                      'mt-1 text-[10px] flex items-center gap-1',
                      mine ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    )}
                  >
                    <span>
                      {new Date(m.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {mine && (
                      <span>{m.readAt ? '✓✓' : '✓'}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className='flex items-center gap-2 border-t border-border p-3'
      >
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={
            canChat ? 'Type a message…' : 'Chat opens after acceptance'
          }
          disabled={!canChat || isSending}
          maxLength={2000}
          className='flex-1'
        />
        <Button
          type='submit'
          size='icon'
          disabled={!canChat || !draft.trim() || isSending}
          aria-label='Send message'
        >
          <Send className='w-4 h-4' />
        </Button>
      </form>
    </div>
  );
}
