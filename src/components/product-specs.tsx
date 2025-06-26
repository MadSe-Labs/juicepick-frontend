interface ProductSpecsProps {
  specs: {
    nicotine: string
    volume: string
    pgvg: string
    flavor: string
    origin: string
    manufacturer: string
    importer: string
  }
}

export default function ProductSpecs({ specs }: ProductSpecsProps) {
  const specItems = [
    { label: "니코틴 함량", value: specs.nicotine },
    { label: "용량", value: specs.volume },
    { label: "PG/VG 비율", value: specs.pgvg },
    { label: "맛", value: specs.flavor },
    { label: "원산지", value: specs.origin },
    { label: "제조사", value: specs.manufacturer },
    { label: "수입사", value: specs.importer },
  ]

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <tbody>
          {specItems.map((item, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
              <td className="px-4 py-3 border-b border-gray-200 w-1/3 font-medium">{item.label}</td>
              <td className="px-4 py-3 border-b border-gray-200">{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
