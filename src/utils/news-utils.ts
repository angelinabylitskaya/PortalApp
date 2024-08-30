import { News, NewsType } from "@/models";

const hasSearchString = ({ title, description }: News, search: string) =>
  search
    ? title.toLowerCase().includes(search.toLocaleLowerCase()) ||
      description.toLowerCase().includes(search.toLocaleLowerCase())
    : true;

export const filterNews = (allNews: News[], type: NewsType, search: string) =>
  type === NewsType.All
    ? search
      ? allNews.filter((news) => hasSearchString(news, search))
      : allNews
    : allNews.filter(
        (news) => news.type === type && hasSearchString(news, search),
      );
