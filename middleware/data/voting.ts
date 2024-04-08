import { supabase } from "@/utils/supabaseClients"

const voteDrop = async ({ type, votingId, user }: { type: string, votingId: number, user: number }) => {

    const { data, error }: any = await supabase.from('voting_data').insert({ user, type, votingId }).select('*');

    if (!error) {
        return data[0];
    }
}

export { voteDrop }