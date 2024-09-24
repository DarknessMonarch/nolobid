"use client";


export default function Skeleton({ width, height, borderRadius }) {
  return (
    <div className="skeleton" style={{ width, height, borderRadius }}></div>
  );
}
