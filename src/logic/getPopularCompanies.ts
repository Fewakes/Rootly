// import { useEffect, useState } from 'react';
// import { getPopularCompanies } from '@/services/companies';
// import type { PopularCompany } from '@/types/types';

// export function usePopularCompanies(limit: number = 5) {
//   const [popularCompanies, setPopularCompanies] = useState<PopularCompany[]>(
//     [],
//   );
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchCompanies = async () => {
//       try {
//         setLoading(true);
//         const companies = await getPopularCompanies(limit);
//         setPopularCompanies(companies);
//       } catch (err) {
//         console.error(err);
//         setError('Failed to fetch popular companies');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCompanies();
//   }, [limit]);

//   return { popularCompanies, loading, error };
// }
