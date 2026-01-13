import { useGetDriverByIdQuery } from '@/redux/features/driver/driver.api';
import { DriverDetailModal } from './DriverDetailModal';

interface IViewDriverDetailsProps {
  open: boolean;
  onClose: () => void;
  Id: string;
}
const ViewDriverDetails = ({ open, onClose, Id }: IViewDriverDetailsProps) => {
  const { data, isLoading } = useGetDriverByIdQuery(Id, { skip: !Id });

  if (!data) return null;

  return (
    <DriverDetailModal
      open={open}
      onOpenChange={onClose}
      data={data.data}
      isLoading={isLoading}
    />
  );
};

export default ViewDriverDetails;
