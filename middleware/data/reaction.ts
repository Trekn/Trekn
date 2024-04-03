import { supabase } from '../../utils/supabaseClients';

export const addReaction = async ({
  dropId,
  userId,
  value,
}: {
  dropId: any;
  userId: any;
  value: number;
}) => {
  const { data, error } = await supabase
    .from('reaction')
    .insert({
      drop_id: dropId,
      user_id: userId,
      kind: value,
    })
    .select('*');

  if (error || !data) {
    console.log(error);
  } else {
    return {
      data: data[0],
    };
  }

  return {};
};
