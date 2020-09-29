import { Photo } from './photo';

export interface User {
    id: number;  //lower case for just by convention
    username: string;
    knownAs: string;
    age: number;
    gender: string;
    created: Date;
    lastActive: Date;
    photoUrl: string;
    city: string;
    country: string;
    interests?: string //when we want something optional we use question mark.
    introduction?: string;
    lookingFor?: string;
    photos?: Photo[];
}
