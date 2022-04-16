import {useState, useContext} from 'react';
import {Link} from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';
import './signup.css';
import logo from '../../assets/logo.png';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [tipo, setTipo] = useState('cliente');

  const {signUp, loadingAuth} = useContext(AuthContext);

  function handleSubmit(e) {
    e.preventDefault();
    if(name !== '' && email !== '' && password !== '') {
      signUp(email, password, name, tipo);
    }
  }

  return (
    <div className='container-center'>
      <div className='login'>
        <div className='login-area'>
          <img src={logo} alt='logo do sistema' />
        </div>

        <form onSubmit={handleSubmit}>
          <h1>Nova conta</h1>
          <input type='text' placeholder='Seu Nome'
            value={name} onChange={e => setName(e.target.value)} /> 
          <input type='email' placeholder='Email@email.com'
           value={email} onChange={(e)=> setEmail(e.target.value)} />
          <input type='password' placeholder='*******'
           value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type='submit'>{loadingAuth ? 'Casdastrando...' : 'Cadastrar'}</button>
          
        </form>

        <Link to='/'>Já tem uma conta? Entre!</Link>

      </div>
    </div>
  );
}

export default SignUp;
