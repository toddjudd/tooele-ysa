import { defineQuery } from "next-sanity";

const imageFields = /* groq */ `
  asset->{
    _id,
    url,
    metadata {
      lqip,
      dimensions { width, height }
    }
  },
  crop,
  hotspot
`;

export const heroImageQuery = defineQuery(/* groq */ `
  *[_type == "heroImage"][0]{
    _id,
    title,
    image { ${imageFields} }
  }
`);

export const homeSectionTopQuery = defineQuery(/* groq */ `
  *[_type == "homeSectionTop"][0]{
    _id,
    eyebrow,
    heading,
    body,
    desktopImage { ${imageFields} },
    mobileImage { ${imageFields} }
  }
`);

export const homeSectionBottomQuery = defineQuery(/* groq */ `
  *[_type == "homeSectionBottom"][0]{
    _id,
    eyebrow,
    heading,
    body,
    desktopImage { ${imageFields} },
    mobileImage { ${imageFields} }
  }
`);

export const leaderCardsQuery = defineQuery(/* groq */ `
  *[_type == "leaderCard"] | order(displayOrder asc){
    _id,
    name,
    title,
    phone,
    email,
    displayOrder
  }
`);

export const upcomingEventsQuery = defineQuery(/* groq */ `
  *[_type == "wardEvent" && dateTime >= now()] | order(dateTime asc)[0...20]{
    _id,
    title,
    dateTime,
    description,
    location
  }
`);
