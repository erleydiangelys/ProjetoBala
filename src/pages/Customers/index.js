import { useState } from 'react';
import './customers.css';
import Header from '../../componentes/Header';
import Title from '../../componentes/Title';
import firebase from '../../services/firebaseConnection';
import { toast } from 'react-toastify';

import {FiUsers} from 'react-icons/fi';


export default function Customers(){
    const [nomeFantasia, setNomeFantasia] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [endereco, setEndereco] = useState('');

    async function handleAdd(e){
        e.preventDefault();
        
        if(nomeFantasia !== '' || cnpj !== '' || endereco !== ''){
            await firebase.firestore().collection('customers')
            .add({
                nomeFantasia: nomeFantasia,
                cnpj: cnpj,
                endereco: endereco
            })
            .then(()=>{
                setNomeFantasia('');
                setCnpj('');
                setEndereco('');
                toast.success('Cliente cadastrado com sucesso!');
            })
            .catch((e)=>{
                console.log(e);
                toast.error('Erro ao cadastrar cliente!');
            })
        } else {
            toast.error('Preencha todos os campos!');
        }
    }

    return(
        <div>
            <Header />
            
            <div className='content'>
                <Title name='Clientes'>
                    <FiUsers size={25} />
                </Title>

                <div className='container'>
                    <form className='form-profile customers' onSubmit={handleAdd}>
                        <label>Nome Fantasia</label>
                        <input type='text'placeholder='Digite aqui o nome da empresa' value={nomeFantasia} 
                        onChange={(e)=> setNomeFantasia(e.target.value)}/>

                        <label>CNPJ</label>
                        <input type='text' placeholder='Digite aqui o CNPJ da empresa' value={cnpj} 
                        onChange={(e)=> setCnpj(e.target.value)}/>

                        <label>Endereço</label>
                        <input type='text'placeholder='Digite aqui o endereço da empresa' value={endereco} 
                        onChange={(e)=> setEndereco(e.target.value)}/>

                        <button type='submit'>Cadastrar</button>

                    </form>

                </div>
            </div>
        </div>
    )
}