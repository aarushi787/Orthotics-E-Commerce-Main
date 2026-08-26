interface Props{
  columns:string[];
  data:any[][];
}

export default function Table({columns,data}:Props){
  return(
    <div className="overflow-x-auto border rounded-lg shadow">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 border-b">
          <tr>
            {columns.map(c=>(
              <th className="px-4 py-3 text-left font-semibold">{c}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row,i)=>(
            <tr key={i} className="border-b hover:bg-gray-50">
              {row.map((col,j)=>(<td key={j} className="px-4 py-3">{col}</td>))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
