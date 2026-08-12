"use client";

import Image from "next/image";
import catAvatar from "../../网页素材/导航栏/小猫ip头像.png";

type NavigationPage = "home" | "cat" | "human";

type SideNavigationProps = {
  activeNavigation: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
};

export function SideNavigation({ activeNavigation, onNavigate }: SideNavigationProps) {
  return (
    <aside className="side-navigation" aria-label="主导航">
      <div className="side-navigation-avatar-frame">
        <Image
          className="side-navigation-avatar"
          src={catAvatar}
          alt="小猫头像"
          priority
        />
      </div>
      <nav className="knowledge-navigation" aria-label="知识库">
        <button
          className="knowledge-navigation-button"
          type="button"
          aria-pressed={activeNavigation === "home"}
          onClick={() => onNavigate("home")}
        >
          首页
        </button>
        <button
          className="knowledge-navigation-button"
          type="button"
          aria-pressed={activeNavigation === "cat"}
          onClick={() => onNavigate("cat")}
        >
          咪的知识库
        </button>
        <button
          className="knowledge-navigation-button"
          type="button"
          aria-pressed={activeNavigation === "human"}
          onClick={() => onNavigate("human")}
        >
          人的知识库
        </button>
      </nav>
    </aside>
  );
}
