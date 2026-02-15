import React from "react";

export const SkeletonRow = () => (
  <tr className="animate-pulse">
    {[1, 2, 3, 4].map((i) => (
      <td key={i} className="px-6 py-4">
        <div className="h-4 bg-secondary/20 rounded-sm w-full" />
      </td>
    ))}
  </tr>
);
