
export default function JanelasComponent() {
    return(
        <div className="flex items-end pl-3 gap-1">
            <button className="px-7 py-2.5 text-sm font-semibold border-t border-x border-zinc-700/80 rounded-t-lg -skew-x-12 bg-zinc-800/90 text-zinc-100 shadow-sm translate-y-px z-10 backdrop-blur-sm transition-all">
                <span className="inline-block skew-x-12">minhas</span>
            </button>
    
            <button className="px-7 py-2.5 text-sm font-medium border-t border-x border-zinc-800 rounded-t-lg -skew-x-12 bg-zinc-900/40 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40 transition-all">
                <span className="inline-block skew-x-12">collabs</span>
            </button>
    
            <button className="px-7 py-2.5 text-sm font-medium border-t border-x border-zinc-800 rounded-t-lg -skew-x-12 bg-zinc-900/40 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40 transition-all">
                <span className="inline-block skew-x-12">publics</span>
            </button>
        </div>
    )
}