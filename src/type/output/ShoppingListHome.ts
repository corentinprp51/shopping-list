import { User } from 'firebase/auth';

export interface ShoppingListHome {
    id: string;
    role: string;
    invitation_link: string;
    title: string;
    users: Array<User & { photo: string }>;
    created_at: string;
    updated_at: string;
    photo: string;
    products?: Array<Product>
}

export interface Product {
    id: string;
    libelle: string;
    checked: boolean;
}
