import 'bootstrap/dist/css/bootstrap.css'
import Header from '../components/header'
import buildCLient from '../api/build-client'

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <div className='container'>
        <Header currentUser={currentUser} />
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  )
}

AppComponent.getInitialProps = async (appContext) => {
  const client = buildCLient(appContext.ctx)
  const { data } = await client.get('api/users/currentuser')

  let pageProps = {}

  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    )
  }

  return {
    pageProps,
    ...data,
  }
}

export default AppComponent
