export interface UserPhoto {
    filepath?: string;
    webviewPath?: string;
    data?: string;
    idNotes?: number;
  }

export interface Photos{
    id?: number,
    userPhoto: UserPhoto
}