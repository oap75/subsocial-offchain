import { PostId, Post } from '@subsocial/types/substrate/interfaces/subsocial';
import { insertActivityForPostReaction } from '../insert-activity';
import { insertNotificationForOwner } from '../notifications';
import { SubstrateEvent } from '../../substrate/types';

export const onRootPostReactionCreated = async (eventAction: SubstrateEvent, post: Post) => {
  const { data } = eventAction;
  const follower = data[0].toString();
  const postId = data[1] as PostId;

  const ids = [ postId ];
  const count = post.upvotes_count.toNumber() + post.downvotes_count.toNumber() - 1;
  const account = post.created.account.toString();
  const activityId = await insertActivityForPostReaction(eventAction, count, ids, account);
  if (activityId === -1) return;

  if (follower === account) return;

  await insertNotificationForOwner(activityId, account);
}