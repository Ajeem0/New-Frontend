import React from "react";



export const CardHeader = ({ children }) => (
  <div className="border-b pb-2 mb-2 font-semibold">{children}</div>
);

export const CardTitle = ({ children }) => (
  <h3 className="text-lg font-bold">{children}</h3>
);

export const CardContent = ({ children }) => <div>{children}</div>;
