import { useGetVehicleByIdQuery } from '@/redux/features/Vehicle/vehicle.api';
import { VehicleDetailModal } from './VehicleDetailModal';

interface IViewViewDetailsProps {
  open: boolean;
  onClose: () => void;
  Id: string;
}
const ViewVehicleDetails = ({ open, onClose, Id }: IViewViewDetailsProps) => {
  const { data, isLoading } = useGetVehicleByIdQuery(Id, { skip: !Id });

  if (!data) return null;

  return (
    <VehicleDetailModal
      open={open}
      onOpenChange={onClose}
      data={data}
      isLoading={isLoading}
    />
  );
};

export default ViewVehicleDetails;
