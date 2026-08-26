interface Props{
  title:string;
  value:string | number;
  icon?:React.ReactNode;
}

export default function StatsCard({title,value,icon}:Props){
  return(
    <div className="flex items-center gap-4 p-5 bg-white border shadow rounded-xl hover:shadow-lg transition">
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
