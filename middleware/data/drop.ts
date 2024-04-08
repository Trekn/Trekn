import { calculateDistance } from '@/functions/calculateDistance';
import { IDrop } from '../../models/types';
import { supabase } from '../../utils/supabaseClients';

export const createDrop = async ({
  drop,
  user,
  onSuccess = () => { },
  onError = () => { },
}: {
  drop: IDrop;
  user?: any;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  const newDrop = {
    ...drop,
    author_id: user.id,
  };
  await supabase
    .from('user')
    .update({ point: user.point + 1 })
    .eq('id', user.id);

  const { data, error } = await supabase
    .from('drop')
    .insert(newDrop)
    .select('*, user(*)');


  if (!error) {
    await supabase
      .from('voting')
      .insert({
        dropId: data[0].id
      })
    onSuccess(data[0]);
  } else {
    onError(error);
  }
};

export const getAllDrops = async ({
  onSuccess = () => { },
  onError = () => { },
}: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  const { data, error } = await supabase.from('drop').select('*, user(*), reaction(*), minted(*)');
  if (!error) {
    onSuccess(data);
  } else {
    onError('');
  }
};

export const getDropByUserAddress = async ({
  userId,
  onError = () => { },
}: {
  userId: Array<number>;
  onError?: (error: any) => void;
}) => {
  const { data, error } = await supabase
    .from('drop')
    .select('*,user(*)')
    .or(`author_id.in.(${userId})`);

  if (!error) {
    return data;
  } else {
    onError('');
    return [];
  }
};

export const getDropByID = async ({ dropId }: { dropId: any }) => {
  let query: string = '*, user(*), minted(*, user(*), reaction(*))'
  if (dropId >= 1765) {
    query = '*, user(*), minted(*, user(*), reaction(*)), voting(id,type,voting_data(*))';
  }
  const { data, error }: any = await supabase
    .from('drop')
    .select(query)
    .eq('id', dropId);

  if (!error) {
    // onSuccess(data);
    return { ...data[0], voting: data[0]?.votiong ? data[0]?.voting[0] : null };
  } else {
    // onError('');
  }
};

export const updateDrop = async ({
  value,
  drop,
  userId,
  onSuccess = () => { },
  onError = () => { },
}: {
  userId: number;
  value: string;
  drop: any;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  const reaction_counts = drop.reaction_counts;
  reaction_counts[value] += 1;
  const { error } = await supabase
    .from('drop')
    .update({ reaction_counts: reaction_counts })
    .eq('id', drop.id);

  if (userId !== drop.user.id) {
    if (value === '1' || value === '0') {
      await supabase
        .from('user')
        .update({ point: drop.user.point + 3 })
        .eq('id', drop.user.id);
    }
  }

  if (error) {
    onError(error);
  }
};

export const getDropType = async ({
  onSuccess = () => { },
  onError = () => { },
}: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  const { data, error } = await supabase.from('type_location').select('*');

  if (!error) {
    onSuccess(data);
  } else {
    onError('');
  }
};

export const getNearByDrop = async ({ lat, lng }: { lat: number, lng: number }) => {
  try {

    const { data, error }: any = await supabase.from('drop').select('*, user(*), reaction(*), minted(*, user(*)), voting(type, voting_data(*))');

    let nearBy: any = [];
    data.map((drop: any) => {
      if (
        drop.radius !== null &&
        // calculateDistance(lat, lng, drop.lat, drop.lng) >= drop.radius &&
        calculateDistance(lat, lng, drop.lat, drop.lng) <= 50000
      ) {
        nearBy.push({
          ...drop,
          distance: calculateDistance(lat, lng, drop.lat, drop.lng),
        });
      }
    });
    nearBy.sort((a: any, b: any) => a.distance - b.distance);
    if (!error) {
      return nearBy.map((item: any) => ({ ...item, voting: item.voting[0] || {} }))
    } else {
      throw new Error(error);
    }
  } catch (e: any) {
    throw new Error(e);
  };
}