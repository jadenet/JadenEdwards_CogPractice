export default function Hero({ onChooseProfile }: { onChooseProfile: () => void }) {
    return (
        <section className="hero relative isolate min-h-80 overflow-hidden rounded-lg border border-primary bg-primary text-primary-content shadow-sm sm:min-h-90">
            <div className="hero-content w-full max-w-none flex-col gap-0 p-0 md:flex-row">
            <div className="flex w-full flex-col items-start justify-center p-7 sm:p-10 lg:p-14 md:w-[55%]">
                <span className="badge badge-outline border-primary-content/40 bg-primary-content/5 text-primary-content">Everyday banking</span>
                <h2 className="mt-4 max-w-xl text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">Everyday banking,<br /><span className="text-lime-300">in one place.</span></h2>
                <p className="mt-4 max-w-md text-sm text-primary-content/80 sm:text-base">Choose a profile to see account balances and activity, or create a new one.</p>
                <button className="btn btn-accent mt-6" onClick={onChooseProfile}>Choose a profile <span className="text-lg font-bold leading-none" aria-hidden="true">↗</span></button>
            </div>
            <div className="relative flex min-h-55 w-full items-center justify-center overflow-hidden md:min-h-80 md:w-[45%]" aria-hidden="true">
                <div className="absolute right-[16%] top-1/2 size-55 -translate-y-1/2 rounded-full border border-white/15 md:size-75" />
                <div className="absolute right-[22%] top-1/2 size-42.5 -translate-y-1/2 rounded-full border border-white/10 md:size-57.5" />
                <div className="relative w-[min(80%,360px)] rotate-[-7deg] overflow-hidden rounded-xl border border-white/20 bg-[#dce9d7] p-5 text-emerald-950 shadow-2xl shadow-black/20 sm:p-8">
                    <div className="flex items-start justify-between">
                        <span className="text-xs font-semibold">ABC BANK</span>
                        <span className="text-[10px] font-medium uppercase text-emerald-900mer00/60">Everyday</span>
                    </div>
                    <div className="my-9 flex h-9 w-12 items-center justify-center rounded-md border border-emerald-900/20 bg-[#c8d9bf]">
                        <span className="grid size-5 grid-cols-2 grid-rows-2 overflow-hidden rounded-sm border border-emerald-900/30"><i className="border-b border-r border-emerald-900/25" /><i className="border-b border-emerald-900/25" /><i className="border-r border-emerald-900/25" /><i /></span>
                    </div>
                    <div className="flex items-end justify-between">
                        <span className="text-sm">•••• &nbsp; •••• &nbsp; •••• &nbsp; ••••</span>
                        <span className="text-2xl font-semibold leading-none">a.</span>
                    </div>
                </div>
                <div className="absolute bottom-[12%] right-[10%] rotate-[5deg] border border-white/20 bg-white/10 px-4 py-3 text-[10px] font-medium uppercase text-white/75">Made for everyday</div>
            </div>
            </div>
        </section>
    )
}