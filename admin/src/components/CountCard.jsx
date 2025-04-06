import React from 'react'

const CountCard = ({img,text,count}) => {
  return (
    <div className="w-[224px] flex bg-white shadow-md rounded-lg pl-4 pr-6 py-5 gap-4 items-center">
      <img src={img} alt="" />
      <div className="flex flex-col">
        <p className='text-2xl font-semibold'>{count}</p>
        <h2 className="text-lg font-semibold text-slate-400">{text}</h2>
      </div>
    </div>
  );
}

export default CountCard
