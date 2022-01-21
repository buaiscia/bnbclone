import { useEffect } from 'react'
import Cookies from 'cookies'
import { useStoreActions } from 'easy-peasy'

import houses from '../houses.js'
import House from '../components/House'
import Layout from '../components/Layout'


const content = (
  <div>
    <h2>Places to stay</h2>

    <div className="houses">
      {houses.map((house, index) => {
        return <House key={index} {...house} />
      })}
    </div>

    <style jsx>{`
        .houses {
          display: grid;
          grid-template-columns: 49% 49%;
          grid-template-rows: 300px 300px;
          grid-gap: 2%;
        }
      `}</style>
  </div>
)

export default function Home({ bnb_session }) {
  const setLoggedIn = useStoreActions((actions) => actions.login.setLoggedIn)

  useEffect(() => {
    if (bnb_session) {
      setLoggedIn(true)
    }
  }, [bnb_session, setLoggedIn])

  return <Layout content={content} />
}

export async function getServerSideProps({ req, res, query }) {
  const cookies = new Cookies(req, res)
  const bnb_session = cookies.get('bnb_session')

  return {
    props: {
      bnb_session: bnb_session || null
    }
  }
}
