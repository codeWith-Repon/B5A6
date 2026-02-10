import { useBookRideMutation } from "@/redux/features/Rider/rider.api";


const BookingDetails = () => {
      const [bookRide, { isLoading: bookRideLoading }] = useBookRideMutation();
      // const bookingData = {
  //   pickupLocation,
  //   dropLocation,
  //   driver: data,
  // };
  // try {
  //   await bookRide(bookingData);
  //   toast.success('Ride Request Sent Successfully');
  //   navigate('/rider/current-ride');
  // } catch (error: any) {
  //   toast.error(error?.data?.message);
  //   console.log(error);
  // }
  return (
    <div>BookingDetails</div>
  )
}

export default BookingDetails