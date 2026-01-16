import React from "react";

export const Select = ({ children }) => (
  <select className="border rounded p-2 w-full">{children}</select>
);

export const SelectTrigger = ({ children }) => <>{children}</>;
export const SelectValue = ({ placeholder }) => (
  <option value="">{placeholder}</option>
);
export const SelectContent = ({ children }) => <>{children}</>;
export const SelectItem = ({ value, children }) => (
  <option value={value}>{children}</option>
);
