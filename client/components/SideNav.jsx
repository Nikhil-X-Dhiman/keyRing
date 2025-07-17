import { TbBorderAll } from "react-icons/tb";
import { SideNavLink } from "./SideNavLink";
import { LuStar } from "react-icons/lu";
import { HiOutlineTrash } from "react-icons/hi2";

export const SideNav = ({ pageMode, setPageMode }) => {
	return (
		<ul className="flex flex-col gap-y-1.5 relative bottom-[10%] text-lg">
			<SideNavLink
				pageMode={pageMode}
				pageModeText="All"
				setPageMode={setPageMode}
				label="All Items"
				Icon={TbBorderAll}
			/>
			<SideNavLink
				pageMode={pageMode}
				pageModeText="Fav"
				setPageMode={setPageMode}
				label="Favourites"
				Icon={LuStar}
			/>
			<SideNavLink
				pageMode={pageMode}
				pageModeText="Trash"
				setPageMode={setPageMode}
				label="Trash"
				Icon={HiOutlineTrash}
			/>
		</ul>
	);
};
