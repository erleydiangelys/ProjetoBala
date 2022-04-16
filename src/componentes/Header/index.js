import './header.css';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import avatar from '../../assets/avatar.png';
import { FiHome, FiUser, FiSettings, FiLogOut } from "react-icons/fi";

import { Link } from 'react-router-dom';


export default function Header() {
    const { user, signOut } = useContext(AuthContext);

    return(
        <div className='sidebar'>
            <div>
                <img 
                src={user.avatarUrl == null ? avatar : user.avatarUrl} 
                alt="foto avatar" />
            </div>

            <Link to="/dashboard">
                <FiHome size={24} color="white" />
                Chamados
            </Link>
            <Link to="/customers">
                <FiUser size={24} color="white" />
                Clientes
            </Link>
            <Link to="/profile">
                <FiSettings size={24} color="white" />
                Configurações
            </Link>
            
            
            <Link onClick={ () => signOut() } >
                <FiLogOut size={24} color="white" />
                Sair
            </Link>

        

            
        </div>
    )

}