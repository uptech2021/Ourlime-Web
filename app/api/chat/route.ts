import { ChatService } from '@/lib/chat/ChatAndFriendService';
import { NextResponse } from 'next/server';


// export async function GET(req: Request) {
//     const { searchParams } = new URL(req.url);
//     const type = searchParams.get('type');
//     const receiverId = searchParams.get('receiverId');

//     const chatService = ChatService.getInstance();

//     switch (type) {
//         case 'messages':
//             if (!receiverId) {
//                 return NextResponse.json(
//                     { error: 'Receiver ID is required' },
//                     { status: 400 }
//                 );
//             }
//             const messages = await chatService.getMessages(receiverId);
//             return NextResponse.json(messages);

//         case 'friends':
//             const friends = await chatService.getFriends();
//             return NextResponse.json(friends);

//         default:
//             return NextResponse.json(
//                 { error: 'Invalid request type' },
//                 { status: 400 }
//             );
//     }
// }

// export async function POST(req: Request) {
//     try {
//         const { receiverId, message } = await req.json();
        
//         if (!receiverId || !message) {
//             return NextResponse.json(
//                 { error: 'Missing required fields' },
//                 { status: 400 }
//             );
//         }

//         const chatService = ChatService.getInstance();
//         const newMessage = await chatService.sendMessage(receiverId, message);
//         return NextResponse.json(newMessage);
//     } catch (error) {
//         return NextResponse.json(
//             { error: 'Failed to send message' },
//             { status: 500 }
//         );
//     }
// }
