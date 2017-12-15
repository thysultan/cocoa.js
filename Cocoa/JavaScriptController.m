#import <Foundation/Foundation.h>
#import <JavaScriptCore/JavaScriptCore.h>
#import "JavaScriptController.h"

@implementation JavaScriptController : NSObject
+ (void) require: (NSString *) file {
	JSContext *context = [[JSContext alloc] init];
	NSURL *url = [[NSBundle mainBundle] URLForResource:file withExtension: @"js"];
	NSString *source = [NSString stringWithContentsOfURL: url encoding:NSUTF8StringEncoding error: nil];
    
	[context setExceptionHandler: ^(JSContext *context, JSValue *error) { NSLog(@"%@", error); }];
	[context setObject: [JavaScriptController self] forKeyedSubscript: @"JavaScriptController"];
	[context evaluateScript: source];
}
+ (void) log: (JSValue *) message {
	NSLog(@"%@", message);
}
+ (void) postMessage: (JSValue *) message {
	NSLog(@"%@", [message toDictionary]);
}
+ (instancetype) instantiate {
	return [[JavaScriptController alloc] init];
}
@end
