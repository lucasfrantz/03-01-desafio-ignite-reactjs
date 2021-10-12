import { GetStaticProps, GetStaticPropsResult } from 'next';

import Prismic from '@prismicio/client';
import Link from 'next/link';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  // TODO
  return (
    <main className={styles.container}>
      {postsPagination.results.map(post => (
        <Link key={post.uid} href={`/post/${post.uid}`}>
          <a className={styles.post}>
            <h2>{post.data.title}</h2>
            <p>{post.data.subtitle}</p>
            <div>
              <FiCalendar />
              <time>{post.first_publication_date}</time>
              <FiUser />
              <p>{post.data.author}</p>
            </div>
          </a>
        </Link>
      ))}
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    { pageSize: 2 }
  );

  console.log(JSON.stringify(postsResponse));
  const { next_page, results } = postsResponse;

  const posts = results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd LLL yyyy',
        { locale: ptBR }
      ),
      data: post.data,
    };
  });

  return { props: { postsPagination: { next_page, results: posts } } };
  // TODO
};
