import axios from 'axios';
import { useEffect, useState } from 'react';

type Beer = {
  id: string;
  name: string;
};

type BeersPageProps = {
  beers: Beer[]
}

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
      <h3>Beers</h3>
      {beers.map(beer => <p key={beer.id}>{beer.name}</p>)}
    </>
  )
}

export default BeersPage

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
