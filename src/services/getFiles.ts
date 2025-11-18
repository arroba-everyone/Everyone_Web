import supabase from '@everyone-web/libs/supabase';

export const getFiles = async () => {
  const xd = await supabase.storage.listBuckets();
  console.log(xd);

  return xd;
};
