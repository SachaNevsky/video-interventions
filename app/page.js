export default function Home() {

	const buttonStyle = "flex items-center justify-center "

	return (
		<div className="bg-black py-4 h-screen text-white text-center grid grid-cols-6 grid-rows-3 gap-2 p-4 text-lg">
			<div className="col-start-1 row-start-2 grid grid-rows-3">
				Subtitle Simplification<br />(Bryan 1)
				<a href="/subtitle_simplification/player" className={buttonStyle}>
					Player 📺
				</a>
				<a href="/subtitle_simplification/control" className={buttonStyle}>
					Controls ⚙
				</a>
			</div>
			<div className="col-start-2 row-start-2 grid grid-rows-3">
				Slower Subtitles<br />(Bryan 2)
				<a href="/slower_subtitles/player" className={buttonStyle}>
					Player 📺
				</a>
				<a href="/slower_subtitles/control" className={buttonStyle}>
					Control ⚙
				</a>
			</div>
			<div className="col-start-3 row-start-2 grid grid-rows-3">
				Context Aware Rewind<br />(Steve 1)
				<a href="/context_aware_rewind/player" className={buttonStyle}>
					Player 📺
				</a>
				<a href="/context_aware_rewind/control" className={buttonStyle}>
					Control ⚙
				</a>
			</div>
			<div className="col-start-4 row-start-2 grid grid-rows-3">
				Reduce Distracting Audio<br />(Jenni 1)
				<a href="/reduce_distracting_audio/player" className={buttonStyle}>
					Player 📺
				</a>
				<a href="/reduce_distracting_audio/control" className={buttonStyle}>
					Control ⚙
				</a>
			</div>
			<div className="col-start-5 row-start-2 grid grid-rows-3">
				Reduce Distracting Visuals<br />(Jenni 2)
				<a href="/reduce_distracting_visuals/player" className={buttonStyle}>
					Player 📺
				</a>
				<a href="/reduce_distracting_visuals/control" className={buttonStyle}>
					Control ⚙
				</a>

			</div>
			<div className="col-start-6 row-start-2 grid grid-rows-3">
				Slower Speech<br />(Sarah 1)
				<a href="/slower_speech/player" className={buttonStyle}>
					Player 📺
				</a>
				<a href="/slower_speech/control" className={buttonStyle}>
					Control ⚙
				</a>
			</div>
		</div>
	);
}
