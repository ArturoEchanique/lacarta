'use client'
import React from "react";
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

const Dashboard = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login')
    }
  })
  return <h1 className="d-flex justify-content-center mt-5">Dashboard</h1>;
};

export default Dashboard;
