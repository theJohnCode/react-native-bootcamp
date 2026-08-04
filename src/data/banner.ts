export interface BannerProps {
  title: string;
  subtitle: string;
  subtitle2: string;
  image: string;
}

export const BannerData: BannerProps[] = [
  {
    title: "Welcome to Hub",
    subtitle: "Mainframe innovation",
    subtitle2: "Development with ZoweHub.",
    image: require("@/assets/images/mock-ui.png"),
  },
  {
    title: "Discover New Features",
    subtitle: "Mainframe technology",
    subtitle2: "Newest tools and features.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80",
  },
  {
    title: "Join the Community",
    subtitle: "Developers and enthusiasts",
    subtitle2: "ZoweHub community.",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=200&q=80",
  },
];
