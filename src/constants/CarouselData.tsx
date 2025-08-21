import { carouselImage } from '@/assets';

export interface ICarouselData {
  id: number;
  img: string;
  title: string;
  description: string;
}
export const carouselData: ICarouselData[] = [
  {
    id: 1,
    img: carouselImage.carouselImage1,
    title: 'Top rated driving partners',
    description:
      'Our drivers are well trained and certified by the Accident Research Institute (ARI) of Bangladesh University of Engineering, and Technology.',
  },
  {
    id: 2,
    img: carouselImage.carouselImage2,
    title: 'Ride tracking',
    description:
      'Book your rides using the app, web, call or WhatsApp and track them online.',
  },
  {
    id: 3,
    img: carouselImage.carouselImage3,
    title: '24*7 customer and driver support',
    description:
      'We has a dedicated 24*7 customer and driver support for all concerns, queries and feedback.',
  },
];
