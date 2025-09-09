interface HeaderProps {
	title: string;
	subTitle?: string;
	options?: React.ReactNode;
}

export default function Header({ title, subTitle, options }: HeaderProps) {
	return (
		<div className="h-[50px] w-full flex items-center justify-between px-4">
			<div className="text-2xl">
				{title} {subTitle && <span className="text-xl">{subTitle}</span>}
			</div>
			{options && options}
		</div>
	)
}