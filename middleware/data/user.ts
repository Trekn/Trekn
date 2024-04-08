import { Alert } from 'react-native';
import { supabase } from '../../utils/supabaseClients';

export const insertUser = async ({
  props,
  onSuccess,
}: {
  props: any;
  onSuccess: (data: any) => void;
}) => {
  const { data, error } = await supabase.from('user').insert(props).select('*');
  if (!error) {
    onSuccess(data[0]);
  } else {
    console.log(error);
  }
};

export const isUserIsExisted = async ({ email }: { email: any }) => {
  const { data, error } = await supabase
    .from('user')
    .select('*')
    .eq('email', email);

  if (!error) {
    if (data?.length === 0) {
      return { isUserIsExist: false, data: [] };
    } else {
      const friends = await getListFriend(data[0]?.id);
      return { isUserIsExist: true, data: {...data[0], friends} };
    }
  }

  return { isUserIsExist: false, data: [] };
};

export const getLeaderBoardPoint = async ({
  onSuccess,
}: {
  onSuccess: (data: any) => void;
}) => {
  const { data, error } = await supabase
    .from('user')
    .select('*')
    .gt('point', 0)
    .order('point', { ascending: false })
    .limit(10);

  if (!error) {
    onSuccess(data);
  }
};

export const getUserByDropId = async ({
  dropId,
  onSuccess,
}: {
  dropId: number;
  onSuccess: (data: any) => void;
}) => {
  const { data, error } = await supabase.from('user').select('*, minted(*)');

  if (!error) {
    const result = data
      .map((user: any) => {
        if (user.minted && Array.isArray(user.minted)) {
          const minted = user.minted.filter(
            (item: any) => item.drop_id === dropId
          );
          if (minted.length) {
            return { ...user, minted };
          }
        }
        return null;
      })
      .filter(Boolean);
    onSuccess(result);
  }
};

export const updateUserDB = async ({
  userId,
  updateData,
  onSuccess,
}: {
  userId: number;
  updateData: any;
  onSuccess: (data: any) => void;
}) => {
  const { data, error } = await supabase
    .from('user')
    .update({ ...updateData })
    .eq('id', userId)
    .select();

  if (!error) {
    onSuccess(data[0]);
  }
};

export const getFollowingById = async ({
  userId,
  onSuccess,
}: {
  userId: number;
  onSuccess: (data: any) => void;
}) => {
  const { data, error }: any = await supabase
    .from('user')
    .select('follow(following)')
    .eq('id', userId);

  if (!error) {
    const result = data[0].follow.map((item: any) => item.following);
    onSuccess(result);
  }
};

export const getFollowerById = async ({
  userId,
  onSuccess,
}: {
  userId: number;
  onSuccess: (data: any) => void;
}) => {
  const { data, error }: any = await supabase
    .from('follow')
    .select('follower')
    .eq('following', userId);

  if (!error) {
    const result = data.map((item: any) => item.follower);
    onSuccess(result);
  }
};

export const getUserAccountData = async ({ userId }: { userId: number }) => {
  const { data, error }: any = await supabase
    .from('user')
    .select('*,drop(*,user(*)), minted(*,drop(*,user(*)),user(*))')
    .eq('id', userId);

  const friends = await getListFriend(userId);

  if (!error) {
    return { ...data[0], friends };
  }
};

export const getListUser = async (userId: Array<number>) => {
  const { data, error }: any = await supabase
    .from('user')
    .select('*')
    .or(`id.in.(${userId})`);

  if (!error) {
    return data;
  }
};

export const linkWallet = async ({
  userId,
  address,
}: {
  userId: any;
  address: string;
}) => {
  const { error } = await supabase
    .from('user')
    .update({ address: address })
    .eq('id', userId);

  if (error) {
    throw error;
  }
};

export const unLinkWallet = async ({ userId }: { userId: number }) => {
  const { error } = await supabase
    .from('user')
    .update({ address: '' })
    .eq('id', userId);
  console.log(error);

  if (error) {
    throw error;
  }
};

export const getAllUserList = async () => {
  const { data, error } = await supabase.from('user').select('*').order('weeklyPoint', { ascending: false }).limit(20).gt('weeklyPoint', 0);
  if (!error) {
    return data;
  }
}

export const getUserById = async (id: any) => {
  const { data, error } = await supabase.from('user').select('*').eq('id', Number(id));
  if (!error) {
    return data[0];
  } else {
    Alert.alert(JSON.stringify(error));
  }
}

export const addFriend = async (userId1: any, userId2: any) => {
  const { data: isExist } = await supabase
    .from('friends')
    .select('*')
    .filter('userId1', 'in', `(${userId1},${userId2})`)
    .filter('userId2', 'in', `(${userId1},${userId2})`)

  if (isExist && isExist.length > 0) {
    return 'Friendship already exists';
  }
  const { data: newFriendship, error } = await supabase
    .from('friends')
    .insert({ userId1, userId2 })
    .select('*');

  if (!error) {
    return 'added successfully';
  } else {
    Alert.alert(JSON.stringify(error));
    return 'Some thing wrong!'
  }
}

export const getListFriend = async (userId: any) => {
  const { data: friendList } = await supabase
    .from('friends')
    .select('*')
    .or(`userId1.eq.${userId},userId2.eq.${userId}`)

  const result = friendList?.map(({ userId1, userId2 }: { id: number, userId1: number, userId2: number }) => {
    if (userId1 === userId) {
      return userId2;
    } else {
      return userId1;
    }
  })
  
  return result;
}