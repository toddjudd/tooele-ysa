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

export const weeklyActivitiesQuery = defineQuery(/* groq */ `
  *[_type == "weeklyActivity"] | order(displayOrder asc){
    _id,
    title,
    subtitle,
    schedule,
    body,
    displayOrder,
    image { ${imageFields} },
    cards[]{
      _key,
      title,
      body,
      linkUrl,
      linkText,
      image { ${imageFields} }
    }
  }
`);

export const sacramentProgramQuery = defineQuery(/* groq */ `
  *[_type == "sacramentProgram"] | order(meetingDate desc)[0]{
    _id,
    meetingDate,
    presiding,
    conducting,
    chorister,
    organist,
    program[]{
      _key,
      _type,
      label,
      number,
      title,
      type,
      person,
      name,
      topic,
      performer
    }
  }
`);

export const upcomingEventsQuery = defineQuery(/* groq */ `
  *[_type == "wardEvent" && status == "approved" && dateTime >= now()] | order(dateTime asc)[0...20]{
    _id,
    title,
    dateTime,
    description,
    location
  }
`);
