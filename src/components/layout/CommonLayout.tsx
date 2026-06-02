import type React from 'react';
import Navbar from './Navbar';
import { Footer } from './Footer';

interface IProps {
  children: React.ReactNode;
}
const CommonLayout = ({ children }: IProps) => {
  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <main className='grow'>{children}</main>
      <Footer />
    </div>
  );
};

export default CommonLayout;
