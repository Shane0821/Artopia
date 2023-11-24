import { useInView } from 'react-intersection-observer';

interface PromptCardProps {
  data: any,
  index: number,
}

function getRandomTransition() {
  const durations = ['0.5s', '1.0s', '1.5s']; // Add more durations as needed
  const timingFunctions = ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear']; // Add more timing functions as needed

  // Generate a random index for duration and timing function
  const duration = durations[Math.floor(Math.random() * durations.length)];
  const timingFunction = timingFunctions[Math.floor(Math.random() * timingFunctions.length)];

  return `${duration} ${timingFunction}`;
}

const PromptCard = ({ data, index }: PromptCardProps) => {
  const [ref, inView] = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  return (
    <div
      ref={ref}
      className="relative mb-3 hover:scale-105"
      style={{
        opacity: (inView ? 1 : 0),
        transition: `opacity ${getRandomTransition()} `
      }}
    >
      <div className="not-prose break-inside-avoid rounded-lg border border-gray-300 bg-white/20 bg-clip-padding p-6 backdrop-blur-lg backdrop-filter relative">
        <div>
          <div className="mb-2 mt-4 whitespace-pre-wrap text-[16px] text-gray-700">
            <p className="w-fit bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% bg-clip-text text-transparent font-bold">Prompt:</p>
            <p className="py-1 break-words">{data.prompt == "" ? " " : data.prompt}</p>
            <p className="pt-2 w-fit bg-gradient-to-r from-fuchsia-500 via-red-600 to-orange-400 bg-clip-text text-transparent font-bold">Negative prompt: </p>
            <p className="py-1 break-words">{data.negative_prompt == "" ? " " : data.negative_prompt}</p>
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