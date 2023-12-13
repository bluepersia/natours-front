import url from '../utils/URL';
import useFetch from '../hooks/useFetch';
import { useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import Tours from '../components/Tours';
export default function ()
{
  const {data, run} = useFetch ();
  
  useEffect (() => {
    run (`${url}/api/v1/tours`);
  }, []);

  const navigate = useNavigate ();

  return <Tours tours={data?.data?.docs}/>
}