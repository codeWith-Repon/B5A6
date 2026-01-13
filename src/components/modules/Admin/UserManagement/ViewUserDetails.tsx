import { useGetUserByIdQuery } from '@/redux/features/User/user.api';
import { UserDetailModal } from './UserDetailModal';

interface IViewViewDetailsProps {
  open: boolean;
  onClose: () => void;
  Id: string;
}
const ViewUserDetails = ({ open, onClose, Id }: IViewViewDetailsProps) => {
  const { data, isLoading } = useGetUserByIdQuery(Id, { skip: !Id });

  if (!data) return null;

  return (
    <UserDetailModal
      open={open}
      onOpenChange={onClose}
      data={data}
      isLoading={isLoading}
    />
  );
};

export default ViewUserDetails;
