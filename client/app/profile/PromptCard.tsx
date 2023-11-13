import Image from '@node_modules/next/image'

interface PromptCardProps {
  data: any,
  index: number,
}

const PromptCard = ({ data, index }: PromptCardProps) => {
  return (
    <div
      className="relative mb-3 hover:scale-105"
    >
      <div className="not-prose break-inside-avoid rounded-lg border border-gray-300 bg-white/20 bg-clip-padding p-6 backdrop-blur-lg backdrop-filter relative">
        <div>       
          <div className="mb-2 mt-4 whitespace-pre-wrap text-[16px] text-gray-700">
            <p className="w-fit bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% bg-clip-text text-transparent font-bold">Prompt:</p>
            <p className="py-1 break-words">{data.prompt=="" ? " ": data.prompt}</p>
            <p className="w-fit bg-gradient-to-r from-fuchsia-500 via-red-600 to-orange-400 bg-clip-text text-transparent font-bold">Negative prompt: </p>
            <p className="py-1 break-words">{data.negative_prompt=="" ? " ": data.negative_prompt}</p>
          </div>
        </div>
        <div className="flex justify-center space-x-8 text-sm text-gray-500 pt-2">
          {/* add to market */}
        </div>
      </div>
    </div>
  )
}

export default PromptCard