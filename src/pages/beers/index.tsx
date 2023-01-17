import axios from 'axios';
import useAxios from 'hooks/useAxios';
import { useEffect, useRef, useState } from 'react';

type Beer = {
  id: string;
  name: string;
};

type BeersPageProps = {
  beers: Beer[]
}

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
