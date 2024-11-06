"use client";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import './globals.css'


const DynamicGameComponent = dynamic(
  () => import('@/game'),
  {
    ssr: false,
    loading: () => <></>,
  }
);

const TestPage: NextPage = () => {
  return <DynamicGameComponent />;
};

export default TestPage;