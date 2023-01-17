This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Axios


#### Getting Started

```shell
yarn add axios
```

#### Statically rendered page using getStaticProps
```typescript
// pages/beers/index.tsx

import axios from 'axios'

const BeersPage = ({ beers }: BeersPageProps) => {
  return (
    <>
      <h1>Beers Page</h1>
      <h3>Beers</h3>
      {beers.map(beer => <p key={beer.id}>{beer.name}</p>)}
    </>
  )
}

export const getStaticProps = async () => {
  const url = 'https://api.punkapi.com/v2/beers';
  let beers: Beer[] = [];

  try {
    const res = await axios.get(url)
    console.log({ res })
    beers = res.data
  } catch (error) {
    console.error({ error })
  }

  return {
    props: {
      beers,
    },
  }
}
```

#### Requests for dynamic data in useEffect

> Doesn't handle aborting requests

```typescript
// pages/beers/index.tsx

import axios from 'axios';

const BeersPage = ({ beers }: BeersPageProps) => {
  const [loading, setLoading] = useState(false);
  const [featuredBeer, setFeaturedBeer] = useState<Beer | undefined>(undefined)
  console.log({ beers })

  useEffect(() => {
    console.log("useEffect")
    const url = 'https://api.punkapi.com/v2/beers/1';
    setLoading(true);

    axios.get(url).then(res => {
      const beer = res.data[0];
      console.log("setting featured beer to: ", {beer})
      setFeaturedBeer(beer);
      setLoading(false);
    });
  }, []);

  const renderFeaturedBeer = () => {
    if (loading) {
      return <p>Loading...</p>
    }

    if (featuredBeer) {
      return <p>Featured Beer: {featuredBeer.name}</p>
    }

    return <p>No featured beer found</p>
  }

  return (
    <>
      <h1>Beers Page</h1>
      {renderFeaturedBeer()}
    </>
  )
}
```

#### Requests for dynamic data using custom useAxios hook

> Doesn't handle aborting requests

```typescript
// with useAxios hook
// pages/beers/index.tsx

const BeersPage = ({ beers }: BeersPageProps) => {
  const API_URL = 'https://api.punkapi.com/v2/beers/1';

  console.log({ staticBeers: beers })

  const { data: dynamicData, loaded } = useAxios<Beer[]>({ url: API_URL });

  console.log({ featuredBeer: dynamicData })

  const renderFeaturedBeer = () => {
    if (!loaded) {
      return <p>Loading...</p>
    }

    if (dynamicData?.length && dynamicData[0]?.name) {
      return <p>Featured Beer: {dynamicData[0].name}</p>
    }

    return <p>No featured beer found</p>
  }

  return (
    <>
      <h1>Beers Page</h1>
      {renderFeaturedBeer()}
      <h3>Beers</h3>
      {beers.map(beer => <p key={beer.id}>{beer.name}</p>)}
    </>
  )
}
```

#### Comments

Axios is nice and simple to get going with. The syntax is straightforward and can be used with `async/await` or .`then`.

For a library like this it might make sense to have a custom hook that makes it even easier to work with rather that writing requests in useEffects.

**Request Cancellation:** https://axios-http.com/docs/cancellation
One thing I noticed is that duplicated requests aren't cancelled automatically for us so we would need to use AbortController. CancelToken is now deprecated.

We might also solve this using GSM. If the data is there then don't re-request it for a short time.
