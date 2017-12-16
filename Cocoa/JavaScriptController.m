#import "JavaScriptController.h"

static JSContext *context = nil;

@implementation JavaScriptController : NSObject
+ (JSValue *) require: (NSString *) file {
	if (context == nil) {
		context = [[JSContext alloc] init];

		[context setExceptionHandler: ^(JSContext *context, JSValue *error) { NSLog(@"%@", error); }];
		[context setObject: [JavaScriptController self] forKeyedSubscript: @"JavaScriptController"];
	}

	NSString *dir = @"src/";
	NSString *path = [[dir stringByAppendingString: file] stringByDeletingPathExtension];
	NSString *url = [[NSBundle mainBundle] pathForResource: path ofType: @"js"];
	NSString *str = [NSString stringWithContentsOfFile: url encoding: NSUTF8StringEncoding error: nil];

	return [context evaluateScript: str];
}
+ (void) log: (JSValue *) message {
	NSLog(@"%@", message);
}
+ (void) postMessage: (JSValue *) message {
	NSDictionary *object = [message toDictionary];
	int action = [[object objectForKey:@"action"] intValue];

	switch (action) {
		case 0: {
			NSLog(@"int %u", action);
			break;
		}
		default: {
			NSLog(@"default branch");
			break;
		}
	}

	NSLog(@"%@", object);
}
+ (instancetype) instantiate {
	return [[JavaScriptController alloc] init];
}
@end
