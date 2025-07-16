export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "tutor" | "student";
  profileImage?: string;
  profileThumbnails?: {
    small: string;
    medium: string;
    large: string;
  };
  createdAt: string;
}

export interface ICourse {
  _id: string;
  title: string;
  slug: string;
  tutorId: string;
  price: number;
  createdAt: string;
}
