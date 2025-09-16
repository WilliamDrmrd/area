import { useState } from 'react';

function ButtonAction({ color, text, onClick, border = false }: { color: string, text: string, onClick?: () => void, border?: boolean }) {
  return (
    <div
      onClick={onClick}
      style={
      {backgroundColor: color}}
      className={`${border ? "border-2 border-white" : ""}
        cursor-pointer lg:mx-8 text-xl flex items-center justify-center text-white px-12 h-12 rounded-3xl
      `}
    >
      {text}
    </div>
  );
}

export default ButtonAction;
